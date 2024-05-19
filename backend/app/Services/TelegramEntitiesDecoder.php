<?php

namespace App\Services;

use JetBrains\PhpStorm\ArrayShape;
use Telegram\Bot\Objects\MessageEntity;

/**
 * Class EntitiesDecoder
 * @package App\Services
 */
class TelegramEntitiesDecoder
{
    private const ENTITY_TYPES = [
        'bold',
        'italic',
        'code',
        'pre',
        'text_mention',
        'text_link',
        'strikethrough',
        'underline',
        'url'
    ];

    /**
     * @param string $text
     * @param MessageEntity[] $entities
     * @return string
     */
    public function decode(string $text, array $entities): string
    {
        $prevEncoding = mb_internal_encoding();
        mb_internal_encoding('UTF-8');

        //split text in char array with UTF-16 code units length
        $arrayText = $this->splitCharAndLength($text);
        $finalText = "";

        $openedEntities = [];
        $currenPosition = 0;
        //Cycle characters one by one to calculate begins and ends of entities and escape special chars
        for ($i = 0; $i < count($arrayText); $i++) {
            $offsetAndLength = $currenPosition + $arrayText[$i]['length'];
            $entityCheckStart = $this->checkForEntityStart($currenPosition, $entities);
            $entityCheckStop = $this->checkForEntityStop($offsetAndLength, $entities);
            if (!empty($entityCheckStart)) {
                foreach ($entityCheckStart as $stEntity) {
                    $startChar = $this->getEntityStartString($stEntity);
                    $openedEntities[] = $stEntity;
                    $finalText .= $startChar;
                }
                $finalText .= $this->escapeSpecialChars($arrayText[$i]['char']);
            }
            if (!empty($entityCheckStop)) {
                if (empty($entityCheckStart)) {
                    $finalText .= $this->escapeSpecialChars($arrayText[$i]['char']);
                }
                foreach ($entityCheckStop as $stEntity) {
                    $stopChar = $this->getEntityStopString($stEntity);
                    $finalText .= $stopChar;
                    array_pop($openedEntities);
                }
            }
            if (empty($entityCheckStart) && empty($entityCheckStop)) {
                $finalText .= $this->escapeSpecialChars($arrayText[$i]['char']);
            }
            $currenPosition = $offsetAndLength;
        }
        if (count($openedEntities) > 0) {
            $openedEntities = array_reverse($openedEntities);
            foreach ($openedEntities as $oe) {
                $finalText .= $this->getEntityStopString($oe);
            }
        }
        if ($prevEncoding) {
            mb_internal_encoding($prevEncoding);
        }

        return $finalText;
    }

    /**
     * Split message text in chars array with lengths
     */
    #[ArrayShape(['char' => 'string', 'length' => 'int'])]
    protected function splitCharAndLength(
        $string
    ): array {
        //Split string in individual unicode points
        $str_split_unicode = preg_split('//u', $string, null, PREG_SPLIT_NO_EMPTY);
        $new_string_split = [];
        $joiner = false;
        for ($i = 0; $i < count($str_split_unicode); $i++) //loop the array
        {
            $codepoint = bin2hex(
                mb_convert_encoding($str_split_unicode[$i], 'UTF-16')
            );    //Get the string representation of the unicode char
            if ($codepoint == "fe0f" || $codepoint == "1f3fb" || $codepoint == "1f3fc" || $codepoint == "1f3fd" || $codepoint == "1f3fe" || $codepoint == "1f3ff")   //Manage the modifiers
            {
                $new_string_split[count(
                    $new_string_split
                ) - 1] .= $str_split_unicode[$i];  //Append the modifier to the previous char
            } else {
                if ($codepoint == "200d")    //Manage the Zero Width Joiner
                {
                    $new_string_split[count(
                        $new_string_split
                    ) - 1] .= $str_split_unicode[$i]; //Append the ZWJ to the previous char
                    $joiner = true;
                } else {
                    if ($joiner) //If previous one was a ZWJ
                    {
                        $new_string_split[count(
                            $new_string_split
                        ) - 1] .= $str_split_unicode[$i];  //Append to the previous char
                        $joiner = false;
                    } else {
                        $new_string_split[] = $str_split_unicode[$i];   //New char
                    }
                }
            }
        }
        $data = [];
        foreach ($new_string_split as $s) {
            $data[] = ["char" => $s, "length" => $this->getUTF16CodePointsLength($s)];
        }
        return $data;
    }

    /**
     * Count UTF-16 code units of the char passed
     */
    protected function getUTF16CodePointsLength($char): int
    {
        $chunks = str_split(bin2hex(mb_convert_encoding($char, 'UTF-16')), 4);
        return count($chunks);
    }

    /**
     * Check if there are entities that start at the given position and return them
     *
     * @param int $pos
     * @return array
     * @var MessageEntity[] $entities
     */
    protected function checkForEntityStart(int $pos, array $entities): array
    {
        return array_filter(
            $entities,
            fn(MessageEntity $entity) => $entity->offset === $pos && in_array($entity->type, static::ENTITY_TYPES)
        );
    }

    /**
     * Check if there are entities that end at the given position and return them (reversed because they are nested)
     */
    protected function checkForEntityStop($pos, array $entities): array
    {
        $entities = array_filter(
            $entities,
            fn(MessageEntity $entity) => $entity->offset + $entity->length === $pos && in_array(
                    $entity->type,
                    static::ENTITY_TYPES
                )
        );

        return count($entities) > 0 ? array_reverse($entities) : [];
    }

    /**
     * Get the begin string of the entity  for the chosen style
     */
    protected function getEntityStartString($entity): string
    {
        return match ($entity->type) {
            'bold' => '<b>',
            'italic' => '<i>',
            'underline' => '<u>',
            'strikethrough' => '<s>',
            'code' => '<code>',
            'pre' => isset($entity->language) ? '<pre><code class="language-' . $entity->language . '">' : '<pre>',
            'text_mention' => '<a href="tg://user?id=' . $entity->user->id . '">',
            'text_link' => '<a href="' . $entity->url . ' " target="_blank">',
            'url' => '<a href="',
        };
    }

    /**
     * Apply Telegram escape rules for the chosen style
     */
    protected function escapeSpecialChars($char)
    {
        return ($char == '<' ? '&lt;' : ($char == '>' ? '&gt;' : ($char == '&' ? '&amp;' : $char)));
    }

    /**
     * Get the end string of the entity  for the chosen style
     */
    protected function getEntityStopString($entity): string
    {
        return match ($entity->type) {
            'bold' => '</b>',
            'italic' => '</i>',
            'underline' => '</u>',
            'strikethrough' => '</s>',
            'code' => '</code>',
            'pre' => isset($entity->language) ? '</code></pre>' : '</pre>',
            'text_mention', 'text_link' => '</a>',
            'url' => '" target="_blank"></a>'
        };
    }
}
